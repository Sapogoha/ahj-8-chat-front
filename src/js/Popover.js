export default class Popover {
  constructor(error, parent) {
    this.parent = parent;
    this.error = error;
    this.errors = {
      empty: {
        title: 'Username is required',
        text: 'Type at least one symbol. This is easy:)',
      },
      taken: {
        title: 'This username is taken.',
        text: 'We believe you are creative enough to choose a unique one:)',
      },
    };
  }

  init() {
    const parentOfParent = this.parent.closest('div');
    const popover = parentOfParent.querySelector('.popover');
    if (popover) {
      popover.remove();
    } else {
      const popoverEl = document.createElement('div');
      popoverEl.classList.add('popover');
      popoverEl.classList.add(`error-${this.error}`);
      const popoverHeader = document.createElement('h3');
      popoverHeader.classList.add('popover-header');
      const popoverMessage = document.createElement('div');
      popoverMessage.classList.add('popover-message');
      if (this.error === 'empty') {
        popoverHeader.textContent = this.errors.empty.title;
        popoverMessage.textContent = this.errors.empty.text;
      } else if (this.error === 'taken') {
        popoverHeader.textContent = this.errors.taken.title;
        popoverMessage.textContent = this.errors.taken.text;
      }
      popoverEl.insertAdjacentElement('beforeend', popoverHeader);
      popoverEl.insertAdjacentElement('beforeend', popoverMessage);
      this.parent.insertAdjacentElement('beforebegin', popoverEl);
      popoverEl.style.top = `${
        this.parent.offsetTop - popoverEl.offsetHeight - 15
      }px`;
      popoverEl.style.left = `${
        this.parent.offsetLeft
        + this.parent.offsetWidth / 2
        - popoverEl.offsetWidth / 2
      }px`;

      setTimeout(() => {
        popoverEl.remove();
      }, 2500);
    }
  }
}
