import Sortable from 'sortablejs/modular/sortable.core.esm.js';

import testData from './test-data';
import generateUniqueId from './generate-unique-id';
import makeLinksClickable from './make-links-clickable';
import setInputAutoHeight from './set-input-auto-height';
import updateFavicon from './favicon';

export default class Todo {
  constructor(element) {
    this.data = JSON.parse(localStorage.getItem('todo')) || [];

    this.todo = document.querySelector('.todo');
    this.todoList = document.querySelector(element);

    this.actionsPanel = document.querySelector('.todo__actions');
    this.toggleAll = document.querySelector('.todo__toggle-all .checkbox__input');
    this.deleteDone = document.querySelector('.todo__delete-done');

    this.addForm = document.querySelector('.todo__form');
    this.input = this.addForm.elements['text'];
    this.submit = this.addForm.elements['submit'];

    this.todoEdit = document.querySelector('.todo-edit');
    this.todoEditForm = document.querySelector('.todo-edit__form');
    this.todoEditInput = document.querySelector('.todo-edit__input');

    this.testData = document.querySelector('.test-data');
    this.testDataBtn = document.querySelector('.test-data__btn');

    this.toggleTestDataBtn();
    this.render();

    Sortable.create(this.todoList, {
      handle: '.todo__move',
      animation: 250,
      ghostClass: 'todo__move--ghost',
      onEnd: event => {
        const data = this.data;
        const oldItem = data[event.oldIndex];
        const newItem = data[event.newIndex];
        this.data[event.newIndex] = oldItem;
        this.data[event.oldIndex] = newItem;
        this.sortByCheckedUnchecked();
        this.saveDataToStorage();
        this.render();
      },
    });

    // Event Handlers
    document.addEventListener('click', event => {
      const element = event.target;
      if (element === this.testDataBtn) {
        const isTestData = true;
        this.addTodoItem(isTestData);
      }
      if (element.matches('.todo__delete-done')) {
        const checkedItems = document.querySelectorAll('.todo__item--done');
        for (const item of checkedItems) {
          const id = item.dataset.id;
          this.removeTodoItem(id);
        }
        this.toggleCheckboxAll();
        this.toggleDeleteDone();
      }
      if (element.matches('.todo__expand')) {
        this.toggleExpandTodoItem(element);
      }
      if (element.matches('.todo__menu-toggle')) {
        this.toggleTodoItemMenu(element);
      }
      if (element.matches('.todo__edit')) {
        this.openTodoItemEditModal(element);
        document.querySelector('.menu-active').classList.remove('menu-active');
      }
      if (element.matches('.todo__delete')) {
        const id = element.dataset.id;
        this.removeTodoItem(id);
      }
      this.closeTodoItemMenu(element);
      if (element.closest('.todo-edit__close') || element.matches('.todo-edit__save')) {
        this.closeTodoItemEditModal();
      }
    });

    document.addEventListener('mousedown', event => {
      if (event.target.matches('.todo-edit')) {
        this.closeTodoItemEditModal();
      }
    });

    document.addEventListener('change', event => {
      const element = event.target;
      if (element.matches('.checkbox__input')) {
        if (element.closest('.todo__toggle-all')) {
          this.onChangeCheckboxAll(element);
          updateFavicon();
        } else {
          this.onChangeCheckbox(element);
        }
      }
    });

    document.addEventListener('keydown', event => {
      const element = event.target;
      if (this.todoEdit.matches('.active') && event.code === 'Escape') {
        this.closeTodoItemEditModal();
      }
      if (event.target === this.input) {
        if (event.code == 'Enter' && !event.ctrlKey) {
          this.onSubmitNewTodo(event);
        } else if (event.code == 'Enter' && event.ctrlKey) {
          this.input.value += '\n';
          setInputAutoHeight(element);
        }
      }
      if (event.target === this.todoEditInput) {
        if (event.ctrlKey && event.code == 'Enter') {
          this.onSaveTodoItem(event);
        }
        if (event.ctrlKey && event.code == 'KeyB') {
          event.preventDefault();
          const selectedText = window.getSelection().toString();
          const boldSelectedText = `<b>${selectedText}</b>`;
          this.todoEditInput.value = this.todoEditInput.value.replace(selectedText, boldSelectedText);
        }
      }
    });

    document.addEventListener('input', event => {
      const element = event.target;
      if (element === this.input) {
        setInputAutoHeight(element);
      }
    });

    document.addEventListener('focusin', event => {
      const element = event.target;
      if (element === this.input) {
        this.todo.classList.add('todo--focus-within');
      }
    });

    document.addEventListener('focusout', event => {
      const element = event.target;
      if (element === this.input) {
        this.todo.classList.remove('todo--focus-within');
      }
    });

    document.addEventListener('submit', event => {
      const element = event.target;
      if (element === this.addForm) {
        this.onSubmitNewTodo(event);
      }
      if (element === this.todoEditForm) {
        this.onSaveTodoItem(event);
      }
    });
    // end Event Handlers
  }

  onRendered() {
    this.toggleActionsPanel();
    this.toggleCheckboxAll();
    this.toggleDeleteDone();
  }

  toggleActionsPanel() {
    if (this.data.length > 0) {
      this.actionsPanel.classList.add('todo__actions--visible');
    } else {
      this.actionsPanel.classList.remove('todo__actions--visible');
    }
  }

  toggleExpandTodoItem(element) {
    const todoItems = document.querySelectorAll('.todo__item');
    element.classList.toggle('todo__expand--active');
    for (const todoItem of todoItems) {
      todoItem.classList.toggle('todo__item--expanded');
    }
  }

  toggleTodoItemMenu(element) {
    element.closest('.todo__item').classList.toggle('menu-active');
  }

  closeTodoItemMenu(element) {
    const activeMenu = document.querySelectorAll('.menu-active');
    for (const menu of activeMenu) {
      if (!element.closest('.todo__menu-toggle') && !element.closest('.menu')) {
        menu.classList.remove('menu-active');
      }
      if (menu.dataset.id !== element.dataset.id && !element.closest('.menu')) {
        menu.classList.remove('menu-active');
      }
    }
  }

  openTodoItemEditModal(element) {
    const id = element.dataset.id;
    const todoItem = this.data.find(item => item.id === id);
    this.todoEdit.classList.add('active');
    this.todoEdit.dataset.id = id;
    this.todoEditInput.value = todoItem.text;
    setTimeout(() => {
      this.todoEditInput.focus();
    }, 100);
  }

  closeTodoItemEditModal() {
    this.todoEdit.classList.remove('active');
  }

  onSubmitNewTodo(e) {
    e.preventDefault();
    if (this.input.value !== '') {
      this.addTodoItem();
      this.input.style.height = 'auto';
    }
  }

  saveDataToStorage() {
    localStorage.setItem('todo', JSON.stringify(this.data));
  }

  async addTodoItem(isTestData = false) {
    if (isTestData) {
      this.data = await testData();
    } else {
      this.data.push({
        id: generateUniqueId(),
        text: this.input.value,
        date: new Date(),
        checked: false,
      });
    }
    this.sortByCheckedUnchecked();
    this.saveDataToStorage();
    this.render();
    this.addForm.reset();
    this.toggleTestDataBtn();
    updateFavicon();
  }

  removeTodoItem(id) {
    const item = document.querySelector(`.todo__item[data-id="${id}"]`);
    item.parentNode.removeChild(item);
    this.data = this.data.filter(item => item.id != id);
    this.saveDataToStorage();
    this.toggleTestDataBtn();
    this.toggleActionsPanel();
    updateFavicon();
  }

  toggleTestDataBtn() {
    if (this.data.length < 1) {
      this.testData.classList.add('show');
    } else {
      this.testData.classList.remove('show');
    }
  }

  toggleCheckboxAll() {
    const checkedItems = document.querySelectorAll('.checkbox:not(.todo__toggle-all) .checkbox__input:checked');
    if (this.data.length > 0 && checkedItems.length === this.data.length) {
      this.toggleAll.checked = !this.toggleAll.checked;
    }
    if (this.data.length === 0) {
      this.toggleAll.checked = false;
    }
  }

  onChangeCheckboxAll(element) {
    const checkboxes = document.querySelectorAll('.checkbox:not(.todo__toggle-all) .checkbox__input');
    if (element.matches(':checked')) {
      checkboxes.forEach(checkbox => {
        const id = checkbox.dataset.id;
        if (!checkbox.matches(':checked')) {
          checkbox.checked = !checkbox.checked;
          this.data.map(item => {
            if (item.id === id) {
              item.checked = true;
            }
          });
          document.querySelector(`.todo__item[data-id="${id}"]`).classList.add('todo__item--done');
        }
      });
    } else {
      checkboxes.forEach(checkbox => {
        const id = checkbox.dataset.id;
        checkbox.checked = !checkbox.checked;
        this.data.map(item => {
          if (item.id === id) {
            item.checked = false;
          }
        });
        document.querySelector(`.todo__item[data-id="${id}"]`).classList.remove('todo__item--done');
      });
    }
    this.saveDataToStorage();
    this.toggleDeleteDone();
  }

  onChangeCheckbox(element) {
    const id = element.dataset.id;
    const checked = !this.data.find(item => item.id === id).checked;

    this.data.map(item => {
      if (item.id === id) {
        item.checked = checked;
      }
    });
    this.sortByCheckedUnchecked();

    if (checked === false) {
      this.toggleAll.checked = false;
    }

    setTimeout(() => {
      this.render();
    }, 350);

    this.saveDataToStorage();
    document.querySelector(`.todo__item[data-id="${id}"]`).classList.toggle('todo__item--done');

    this.toggleDeleteDone();
    updateFavicon();
  }

  toggleDeleteDone() {
    const checkedItems = document.querySelectorAll('.todo__item--done');
    if (checkedItems.length > 0) {
      this.deleteDone.style.display = 'block';
    } else {
      this.deleteDone.style.display = 'none';
    }
    this.toggleActionsPanel();
  }

  sortByCheckedUnchecked() {
    const data = this.data;
    const checkedItems = data.filter(item => item.checked === true);
    const uncheckedItems = data.filter(item => item.checked !== true);
    this.data = [...uncheckedItems, ...checkedItems];
  }

  onSaveTodoItem(event) {
    event.preventDefault();
    const id = this.todoEdit.dataset.id;
    this.data.map(item => {
      if (item.id === id) {
        item.text = this.todoEditInput.value;
      }
    });
    this.saveDataToStorage();
    this.closeTodoItemEditModal(event);
    this.render();
  }

  render() {
    let html = '';
    for (const item of this.data) {
      const id = item.id;
      let text = item.text;
      const date = new Date(item.date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const time = new Date(item.date).toLocaleString('ru-RU', {
        hour: 'numeric',
        minute: 'numeric',
      });

      text = text.replace(/\n/g, '<br>');
      text = makeLinksClickable(text, 'todo__link');

      html += /* html */ `
        <li class="todo__item${item.checked ? ' todo__item--done' : ''}" data-id="${id}">
          <div class="todo__move">
            <svg width="26" height="26">
              <use xlink:href="assets/img/sprite.svg#icon-move" />
            </svg>
          </div>

          <label class="checkbox todo__check">
            <input
              class="checkbox__input visually-hidden"
              type="checkbox"
              data-id="${id}"
              ${item.checked ? 'checked' : ''}
            >
            <svg class="checkbox__svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path class="checkbox__path" d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline class="checkbox__polyline" points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>

          <div class="todo__content">
            <div class="todo__text">
              <p class="todo__text-inner">${text}</p>
            </div>
            <p class="todo__date">Добавлено: ${date} в ${time}</p>
          </div>

          <button class="todo__menu-toggle" type="button" data-id="${id}">
            <svg class="todo__menu-toggle-icon" width="24" height="24">
              <use xlink:href="assets/img/sprite.svg#icon-dots" />
            </svg>
          </button>

          <ul class="menu">
            <li class="menu__item">
              <button class="menu__btn todo__edit" type="button" data-id="${id}">
                <svg class="menu__btn-icon" width="20" height="20">
                  <use xlink:href="assets/img/sprite.svg#icon-edit" />
                </svg>
                Редактировать
              </button>
            </li>
            <li class="menu__item">
              <button class="menu__btn todo__delete" type="button" data-id="${id}">
                <svg class="menu__btn-icon" width="20" height="20">
                  <use xlink:href="assets/img/sprite.svg#icon-delete" />
                </svg>
                Удалить
              </button>
            </li>
          </ul>
        </li>
      `;
    }
    this.todoList.replaceChildren();
    this.todoList.insertAdjacentHTML('beforeend', html);
    this.onRendered();
  }
}
