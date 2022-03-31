import CodeMirror from "@uiw/react-codemirror";
import store from '@/store';

export default () => {
  const [ code, dispatchers ] = store.useModel('code');
  function onCodeChange(value) {
    dispatchers.setActiveCode(value);
  }
  return (
    <CodeMirror
      value={code.value}
      theme="light"
      width="100%"
      onChange={(value, viewUpdate) => {
        console.log("🚀 ~ file: index.tsx ~ line 15 ~ viewUpdate", viewUpdate)
        console.log("🚀 ~ file: index.tsx ~ line 17 ~ value", value)
        onCodeChange(value);
      }}
      // extensions={[javascript({ jsx: true })]}
    />
  );
}
