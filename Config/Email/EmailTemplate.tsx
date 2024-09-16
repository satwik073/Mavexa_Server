import React from 'react';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useStyles, email_content_rendering, EMAIL_TAG_BINDING } from './Constants/use_styles';
import { EmailDeliverablesContent, VariantsType } from '../../Common/structure';
type EmailDeliverableProps = {
    receivers_username: string; 
    product_by_company: string;
    otp_for_verification: string;
};

 const EmailTemplate: React.FC<EmailDeliverableProps> = ({
    receivers_username, 
    product_by_company, 
    otp_for_verification
}) => {
    const classes = useStyles();
    const rendered_content_email = email_content_rendering(receivers_username, otp_for_verification, product_by_company).map((item: EmailDeliverablesContent) => {
        const email_content =  (item.content_rendering || '')
            .replace('{receivers_username}', receivers_username || 'user')
            .replace('{otp_for_verification}', otp_for_verification || '000000')
            .replace('{product_by_company}', product_by_company || 'XYZ')

        return (
            <Typography
                key={email_content}
                className={item.text_context === VariantsType.OTP_TRACES ? classes.OTP_REQUESTED : classes.PARAGRAPH_TYPO}
                variant={item.text_context === VariantsType.OTP_TRACES ? 'h2' : 'body1'}
            >
                {email_content}
            </Typography>
        );
    });

    return (
        <EMAIL_TAG_BINDING._Bx component="header" className={classes.CONTAINER_REDESIGNED}>
            <EMAIL_TAG_BINDING._T className={classes.TABLE_WRAPPER}>
                <EMAIL_TAG_BINDING._Tb>
                    <EMAIL_TAG_BINDING._TB>
                        <EMAIL_TAG_BINDING._TR>
                            <EMAIL_TAG_BINDING._TC className={classes.HEADER_CONTAINER}>
                                <EMAIL_TAG_BINDING._P variant="h1" className={classes.HEADER_TITLE}>
                                    Welcome to {product_by_company}!
                                </EMAIL_TAG_BINDING._P>
                            </EMAIL_TAG_BINDING._TC>
                        </EMAIL_TAG_BINDING._TR>
                        <EMAIL_TAG_BINDING._TR>
                            <EMAIL_TAG_BINDING._TC className={classes.BODY_PLANNED}>
                                {rendered_content_email}
                            </EMAIL_TAG_BINDING._TC>
                        </EMAIL_TAG_BINDING._TR>
                        <EMAIL_TAG_BINDING._TR>
                            <EMAIL_TAG_BINDING._TC className={classes.FOOTER_CONTAINER}>
                                <EMAIL_TAG_BINDING._P className={classes.FOOTER_TEXT}>
                                    &copy; {new Date().getFullYear()} {product_by_company}. All rights reserved.
                                </EMAIL_TAG_BINDING._P>
                            </EMAIL_TAG_BINDING._TC>
                        </EMAIL_TAG_BINDING._TR>
                    </EMAIL_TAG_BINDING._TB>
                </EMAIL_TAG_BINDING._Tb>
            </EMAIL_TAG_BINDING._T>
        </EMAIL_TAG_BINDING._Bx>
    );
};
export default EmailTemplate