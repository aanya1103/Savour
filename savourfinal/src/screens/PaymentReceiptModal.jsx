//PaymentReceiptModal.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function PaymentReceiptModal({ open, onClose, onDownloadReceipt }) {
  return (
    <Dialog open={open} onClose={onClose} sx={{ backdropFilter: 'blur(4px)' }}>
      <DialogTitle sx={{ backgroundColor: '#2196f3', color: '#fff' }}>Payment Confirmation</DialogTitle>
      <DialogContent sx={{ padding: '20px' }}>
        <Typography variant="body1">Your payment has been successfully processed.</Typography>
        <Typography variant="body1">Click the button below to download your receipt.</Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '10px 20px', justifyContent: 'center' }}>
        <Button onClick={onDownloadReceipt} variant="contained" color="primary">
          Download Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentReceiptModal;