import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmActivityDeleteDialogProps {
  activity: Activity | null;
  onClose: (response: boolean) => void;
  open:boolean;
}

const ConfirmActivityDeleteAlertDialog = ({activity, onClose, open}: ConfirmActivityDeleteDialogProps)=>  {
  return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          "Delete This Activity?"
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to delete activity "{activity?.name}". This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>onClose(true)}>Delete</Button>
          <Button onClick={()=>onClose(false)} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

  );
}


export default ConfirmActivityDeleteAlertDialog;