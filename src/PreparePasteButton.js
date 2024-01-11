import React, { useRef, useState } from 'react';
import {Modal, ModalBody} from 'reactstrap'

function PreparePasteButton({className, onPaste, onFallbackError, onFallbackPaste}) {
  const [showFallback, setShowFallback] = useState(false);

  const toggleFallback = function() {
    setShowFallback(!showFallback);
  }

  return (
    <React.Fragment>
      <a
        className={className}
        onClick={async () => {
          try {
            const text = await navigator.clipboard.readText();
            if (text !== "") {
              onPaste(text)
            }
          } catch (e) {
            console.log('Paste failed. Attempting fallback.', e);  // eslint-disable-line no-console
            toggleFallback();
          }
        }}
        tabIndex={0}
      >
        Prepare paste
      </a>
      <FallbackPasteModal
        isOpen={showFallback}
        onError={onFallbackError}
        onPaste={onFallbackPaste}
        toggle={toggleFallback}
      />
    </React.Fragment>
  );
}

function FallbackPasteModal({isOpen, onError, onPaste, toggle}) {
  const textRef = useRef();

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        <h4>Paste Text</h4>
        <p>
          To allow your desktop session to gain access to the pasted text,
          paste your text in the text area below and click "OK".
        </p>
        <p>
          Your session's clipboard will be updated and you will be able to
          paste normally from within your session.
        </p>
        <textarea ref={textRef} style={{ width: "100%", height: "7em" }}></textarea>
        <div className="d-flex justify-content-center">
          <button
            className="button link white-text mr-3"
            onClick={() => {
              try {
                onPaste(textRef.current.value);
              } catch (e) {
                console.log('Fallback failed.', e);  // eslint-disable-line no-console
                onError(e);
              } finally {
                toggle();
              }
            }}
          >
            OK
          </button>
          <button className="button link blue-text cancel-button" onClick={toggle}>
            Cancel
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default PreparePasteButton;
