import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'

import ACTION_TOOLS from '../config/action-tools.js'

function actionTool(
  state,
  { key, icon, label, badge, disabled, onClick, active },
) {
  return html`
    <button
      ?disabled=${disabled || !ACTION_TOOLS[key]}
      class="tool ${classMap({ active })}"
      @click="${onClick}"
    >
      ${icon !== undefined
        ? html` <i class="fa-sharp fas fa-fw fa-${icon}"></i> `
        : ''}
      ${label !== undefined ? html` <span class="label">${label}</span> ` : ''}
      ${badge !== undefined ? html` <span class="badge">${badge}</span> ` : ''}
    </button>
  `
}

function actionTools(state) {
  return html`
    <div class="action-tools">
      <div class="tool-group">
        ${actionTool(state, ACTION_TOOLS.undo(state))}
        ${actionTool(state, ACTION_TOOLS.redo(state))}
      </div>
      <div class="tool-group">
        ${actionTool(state, ACTION_TOOLS.zoomIn(state))}
        ${actionTool(state, ACTION_TOOLS.zoomOut(state))}
      </div>
      <div class="tool-group">
        ${actionTool(state, ACTION_TOOLS.clear(state))}
        ${actionTool(state, ACTION_TOOLS.grid(state))}
      </div>
      <div class="tool-group">
        ${actionTool(state, ACTION_TOOLS.resize(state))}
      </div>
      <div class="tool-group">
        ${actionTool(state, ACTION_TOOLS.export(state))}
        ${actionTool(state, {
          key: 'background',
          icon: 'swatchbook',
          label: 'Background',
        })}
      </div>
    </div>
  `
}

export default actionTools
