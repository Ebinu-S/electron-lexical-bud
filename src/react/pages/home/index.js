import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CLEAR_EDITOR_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';

import { $generateHtmlFromNodes } from '@lexical/html';

import '../../styles/editor.css';
import { updateSave, addHistory } from 'react/features/editorSlice';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from '@lexical/list';

function Home() {
  const saved_value = useSelector((state) => state.editor.value);
  const history_value = useSelector((state) => state.editor.history);
  const dispatch = useDispatch();
  const editorStateRef = useRef();

  const theme = {
    heading: {
      h1: 'glyf-editor-h1',
    },
  };

  function onChange(editorState) {
    editorStateRef.current = editorState;
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  function onError(error) {
    console.error(error);
  }

  function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      // Focus the editor when the effect fires
      editor.focus();
    }, [editor]);

    return null;
  }

  function HeadingPlugin() {
    const [editor] = useLexicalComposerContext();

    const onClick = (type = 'h1') => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(type));
        }
      });
    };

    return (
      <div>
        <button onClick={() => onClick('h1')}>H1</button>;
        <button onClick={() => onClick('h2')}>H2</button>;
        <button onClick={() => onClick('h3')}>H3</button>;
        <button onClick={() => onClick('h4')}>H4</button>;
      </div>
    );
  }

  // function ClearEditorPlugin() {
  //   const [editor] = useLexicalComposerContext();

  //   const onClick = () => {
  //     console.log('inn');
  //     editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  //   };

  //   return <button onClick={onClick}>Clear</button>;
  // }

  function ListPlugin() {
    const [editor] = useLexicalComposerContext();

    const onClick = (tag) => {
      if (tag === 'ol') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null);
        return;
      }
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null);
    };

    return (
      <>
        <button onClick={() => onClick('ol')}>ol</button>
        <button onClick={() => onClick('ul')}>ul</button>
      </>
    );
  }

  function TextFormat() {
    const [editor] = useLexicalComposerContext();

    const onClick = (format = 'bold') => {
      if (format === 'bold') {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      } else if (format === 'italics') {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }
    };

    return (
      <>
        <button onClick={() => onClick('bold')}>B</button>
        <button onClick={() => onClick('italics')}>
          <em>i</em>
        </button>
      </>
    );
  }

  function History() {
    const [editor] = useLexicalComposerContext();

    const onClick = (type = 'undo') => {
      if (type === 'undo') {
        editor.dispatchCommand(UNDO_COMMAND, null);
        return;
      }
      editor.dispatchCommand(REDO_COMMAND, null);
    };

    return (
      <>
        <button onClick={() => onClick('undo')}>undo</button>
        <button onClick={() => onClick('redo')}>redo</button>
      </>
    );
  }

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    editorState: saved_value ?? '',
    nodes: [HeadingNode, ListItemNode, ListNode],
  };

  const handleSave = () => {
    if (editorStateRef.current) {
      //save

      dispatch(updateSave(JSON.stringify(editorStateRef.current)));
    }
  };

  const HandleSent = () => {
    const [editor] = useLexicalComposerContext();

    function handleSent() {
      editor.update(() => {
        const editorState = editor.getEditorState();
        const stringified = JSON.stringify(editorState);

        const htmlString = $generateHtmlFromNodes(editor, null);

        dispatch(addHistory(htmlString));
      });
    }

    return <button onClick={handleSent}>Sent</button>;
  };

  return (
    <div className="editorWrapper">
      <LexicalComposer initialConfig={initialConfig}>
        <HeadingPlugin />
        <ListPlugin />
        <TextFormat />
        <History />

        <RichTextPlugin
          contentEditable={<ContentEditable className="contentEditable" />}
          placeholder={
            <div className="placeholder">Hi i am just a placeholder...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ClearEditorPlugin />

        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />

        <button onClick={handleSave}>Save</button>
        <HandleSent />
      </LexicalComposer>

      <div>
        <h4>History</h4>
        {history_value?.length > 0 ? (
          history_value.map((data, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: data,
              }}
              style={{
                border: '2px solid red',
                padding: '8px',
              }}
            ></p>
          ))
        ) : (
          <p>No history</p>
        )}
      </div>
    </div>
  );
}

export default Home;
