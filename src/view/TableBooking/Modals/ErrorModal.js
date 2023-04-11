import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ErrorModal(props) {
    const launch = useSelector(state => state.launch) 
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

  useEffect(() => {
      if (props.errorMessage) setModal(!modal)
  }, [props.errorMessage])

  return (
    <div> 
      <Modal isOpen={modal} toggle={toggle} > 
        <ModalBody>
        {props.errorMessage}
        </ModalBody>
        <ModalFooter> 
          <Button color="secondary" onClick={toggle} size='sm'>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ErrorModal;