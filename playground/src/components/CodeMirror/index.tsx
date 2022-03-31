import CodeMirror from '@uiw/react-codemirror';
import store from '@/store';

export default () => {
  const [code, dispatchers] = store.useModel('code');
  function onCodeChange(value) {
    dispatchers.setActiveCode(value);
  }
  return (
    <CodeMirror
      value={code.value}
      theme="light"
      width="100%"
      autoFocus={true}
      onChange={(value, viewUpdate) => {
        onCodeChange(value);
        console.log("🚀 ~ file: index.tsx ~ line 18 ~ viewUpdate", viewUpdate)
      }}
      // extensions={[javascript({ jsx: true })]}
    />
  );
};
