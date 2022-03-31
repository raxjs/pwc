import CodeMirror from "../CodeMirror"
import Output from '../Output';

import './index.css';

export default () => {
  return (
    <div className="repl-container">
      <div className="left-panel">
        <CodeMirror />
      </div>
      <div className="right-panel">
        <Output />
      </div>
    </div>
  )
}
