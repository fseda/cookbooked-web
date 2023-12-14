import { theme, type ColorScheme } from "$lib/stores/theme";

export const initTheme = () => {
    const themeManager = {
        _scheme: "auto",
        change: {
            light: "<i>Turn on dark mode</i>",
            dark: "<i>Turn off dark mode</i>"
        },
        buttonsTarget: ".theme-switcher",
        localStorageKey: "picoPreferredColorScheme",
        init() {
            this.scheme = this.schemeFromLocalStorage || 'light';
            theme.set(this.scheme as ColorScheme);
            this.initSwitchers()
        },
        get schemeFromLocalStorage() {
            return void 0 !== window.localStorage && null !== window.localStorage.getItem(this.localStorageKey) ? window.localStorage.getItem(this.localStorageKey) : this._scheme
        },
        get preferredColorScheme() {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        },
        initSwitchers() {
            document.querySelectorAll(this.buttonsTarget).forEach(e=>{
                e.addEventListener("click", ()=>{
                    "dark" == this.scheme ? this.scheme = "light" : this.scheme = "dark"
                    theme.set(this.scheme as ColorScheme);
                }
                , !1)
            }
            )
        },
        addButton(e: { tag: string; class: string; target: string; }) {
            const t = document.createElement(e.tag);
            t.className = e.class,
            (document.querySelector(e.target) as HTMLElement).appendChild(t)
        },
        set scheme(e) {
            "auto" == e ? "dark" == this.preferredColorScheme ? this._scheme = "dark" : this._scheme = "light" : "dark" != e && "light" != e || (this._scheme = e),
            this.applyScheme(),
            this.schemeToLocalStorage()
        },
        get scheme() {
            return this._scheme
        },
        applyScheme() {
            (document.querySelector("html") as HTMLHtmlElement).setAttribute("data-theme", this.scheme),
            document.querySelectorAll(this.buttonsTarget).forEach(e=>{
                const t = "dark" == this.scheme ? this.change.dark : this.change.light;
                e.innerHTML = t,
                e.setAttribute("aria-label", t.replace(/<[^>]*>?/gm, ""))
            }
            )
        },
        schemeToLocalStorage() {
            void 0 !== window.localStorage && window.localStorage.setItem(this.localStorageKey, this.scheme)
        }
    }
      , toggleManager = {
        _state: "closed-on-mobile",
        toggleLink: document.getElementById("toggle-docs-navigation"),
        nav: document.querySelector("main > aside > nav"),
        init() {
        },
        get state() {
            return this._state
        },
        set state(e) {
            this._state = e
        }
    };
    themeManager.addButton({
        tag: "BUTTON",
        class: "contrast switcher theme-switcher",
        target: "body"
    }),
    themeManager.init(),
    toggleManager.init()
};
