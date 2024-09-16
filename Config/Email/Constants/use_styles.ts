import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { EmailDeliverablesContent, VariantsType } from '../../../Common/structure';

export const EMAIL_TAG_BINDING = {
    _H: Typography,
    _P: Typography,
    _Bx: Box,
    _TC: TableCell,
    _TR: TableRow,
    _TB: TableBody,
    _T: TableContainer,
    _Tb: Table,
};

export const email_content_rendering = (
    recievers_username: string,
    otp_for_verification: string,
    product_by_company: string
): EmailDeliverablesContent[] => [
    { text_context: VariantsType.TEXT, content_rendering: `Hello ${recievers_username},` },
    { text_context: VariantsType.TEXT, content_rendering: 'Here is your One-Time Password (OTP) for verifying your account:' },
    { text_context: VariantsType.OTP_TRACES, content_rendering: otp_for_verification },
    { text_context: VariantsType.TEXT, content_rendering: 'If you did not request this code, please ignore this email.' },
    { text_context: VariantsType.TEXT, content_rendering: `Thank you for choosing ${product_by_company}!` },
];

export const useStyles = makeStyles((theme: any) => ({
    CONTAINER_REDESIGNED: {
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#fef4e5',
    },
    TABLE_WRAPPER: {
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        width: '100%',
    },
    HEADER_CONTAINER: {
        padding: '20px',
        backgroundColor: '#f7c300',
        color: '#ffffff',
        textAlign: 'center',
    },
    HEADER_TITLE: {
        margin: 0,
        fontSize: '24px',
    },
    BODY_PLANNED: {
        padding: '20px',
    },
    PARAGRAPH_TYPO: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333333',
    },
    OTP_REQUESTED: {
        color: '#f7c300',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '32px',
        margin: '10px 0',
    },
    FOOTER_CONTAINER: {
        padding: '20px',
        backgroundColor: '#fef4e5',
        textAlign: 'center',
    },
    FOOTER_TEXT: {
        fontSize: '14px',
        color: '#888888',
        margin: 0,
    },
}));



