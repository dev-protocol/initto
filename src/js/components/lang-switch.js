// For syntax highlighting only
const html = String.raw;

class LangSwitch extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'lang';
  }

  connectedCallback() {
    this.render();
  }

  applySetting(passedSetting) {
    let currentSetting = passedSetting || localStorage.getItem(this.STORAGE_KEY);
    localStorage.setItem(this.STORAGE_KEY, currentSetting);
    this.setButtonLabelAndStatus(currentSetting);
  }

  setButtonLabelAndStatus(currentSetting) {
    for (let i = 0; i < this.modeToggleButton.children.length; i++) {
      let opt = this.modeToggleButton.children[i];
      if (currentSetting === opt.getAttribute('value')) {
        this.modeToggleButton.children[i].setAttribute('selected', '');
      }
    }
  }

  render() {
    this.innerHTML = html`
      <div class="[ lang-switch ] [ md:ta-right gap-bottom-500 ]">
        <select class="[ select ] [ font-base text-base ] [ js-lang-select ]">
          <option value="en">English (en)</option>
          <option value="ja">Japanese (ja)</option>
          <option value="pt">Português (pt)</option>
        </select>
      </div>
    `;

    this.afterRender();
  }

  afterRender() {
    this.modeToggleButton = document.querySelector('.js-lang-select');

    this.modeToggleButton.addEventListener('change', evt => {
      const lang = evt.target.value;
      evt.preventDefault();
      this.applySetting(lang);
      const url = location.protocol + '//' + location.host + '/' + lang;
      location.href = url;
    });

    this.applySetting();
  }
}

if ('customElements' in window) {
  customElements.define('lang-switch', LangSwitch);
}

export default LangSwitch;
