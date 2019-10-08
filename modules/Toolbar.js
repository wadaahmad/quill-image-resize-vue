import {BaseModule} from './BaseModule';

import {Quill} from 'vue-quill-editor'

window.Quill = Quill;

const Parchment = window.Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style('float', 'float');
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
const DisplayStyle = new Parchment.Attributor.Style('display', 'display');

export class Toolbar extends BaseModule {
    onCreate = () => {
        // Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

    // The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {
    };

    // Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {
    };

    _defineAlignments = () => {
        this.alignments = [
            {
                icon: `<svg viewbox="0 0 18 18">
                          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
                          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
                          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
                        </svg>`,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) === 'left',
            },
            {
                icon: `<svg viewbox="0 0 18 18">
                          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
                          <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
                          <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
                        </svg>`,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');
                },
                isApplied: () => MarginStyle.value(this.img) === 'auto',
            },
            {
                icon: `<svg viewbox="0 0 18 18">
                          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
                          <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
                          <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
                        </svg>`,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');
                },
                isApplied: () => FloatStyle.value(this.img) === 'right',
            },
        ];
    };

    _addToolbarButtons = () => {
        const buttons = [];
        this.alignments.forEach((alignment, idx) => {
            const button = document.createElement('span');
            buttons.push(button);
            button.innerHTML = alignment.icon;
            button.addEventListener('click', () => {
                // deselect all buttons
                buttons.forEach(button => button.style.filter = '');
                if (alignment.isApplied()) {
                    // If applied, unapply
                    FloatStyle.remove(this.img);
                    MarginStyle.remove(this.img);
                    DisplayStyle.remove(this.img);
                } else {
                    // otherwise, select button and apply
                    this._selectButton(button);
                    alignment.apply();
                }
                // image may change position; redraw drag handles
                this.requestUpdate();
            });
            Object.assign(button.style, this.options.toolbarButtonStyles);
            if (idx > 0) {
                button.style.borderLeftWidth = '0';
            }
            if (button.children.length) {
                Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
            }
            if (alignment.isApplied()) {
                // select button if previously applied
                this._selectButton(button);
            }
            this.toolbar.appendChild(button);
        });
    };

    _selectButton = (button) => {
        button.style.filter = 'invert(20%)';
    };

}
