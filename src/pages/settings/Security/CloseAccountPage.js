import React, {
    useCallback, useState,
} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import _ from 'underscore';
import HeaderWithCloseButton from '../../../components/HeaderWithCloseButton';
import Navigation from '../../../libs/Navigation/Navigation';
import ROUTES from '../../../ROUTES';
import * as User from '../../../libs/actions/User';
import compose from '../../../libs/compose';
import styles from '../../../styles/styles';
import ScreenWrapper from '../../../components/ScreenWrapper';
import TextInput from '../../../components/TextInput';
import Text from '../../../components/Text';
import withLocalize, {withLocalizePropTypes} from '../../../components/withLocalize';
import withWindowDimensions, {windowDimensionsPropTypes} from '../../../components/withWindowDimensions';
import * as CloseAccount from '../../../libs/actions/CloseAccount';
import ONYXKEYS from '../../../ONYXKEYS';
import Form from '../../../components/Form';
import CONST from '../../../CONST';
import ConfirmModal from '../../../components/ConfirmModal';

const propTypes = {
    /** Session of currently logged in user */
    session: PropTypes.shape({
        /** Email address */
        email: PropTypes.string.isRequired,
    }),

    ...windowDimensionsPropTypes,
    ...withLocalizePropTypes,
};

const defaultProps = {
    session: {
        email: null,
    },
};

function CloseAccountPage (props) {
    const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false);
    const [reasonForLeaving, setReasonForLeaving] = useState('');

    const hideConfirmModal = () => {
        setConfirmModalVisibility(false);
    };

    const onConfirm = () => {
        User.closeAccount(reasonForLeaving);
        hideConfirmModal();
    };

    const showConfirmModal = (values) => {
        setConfirmModalVisibility(true);
        setReasonForLeaving(values.reasonForLeaving);
    };

    const validate = (values) => {
        const userEmailOrPhone = props.formatPhoneNumber(props.session.email);
        const errors = {};

        if (_.isEmpty(values.phoneOrEmail) || userEmailOrPhone.toLowerCase() !== values.phoneOrEmail.toLowerCase()) {
            errors.phoneOrEmail = props.translate('closeAccountPage.enterYourDefaultContactMethod');
        }
        return errors;
    };

    const userEmailOrPhone = props.formatPhoneNumber(props.session.email);

    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={false}>
            <HeaderWithCloseButton
                title={props.translate('closeAccountPage.closeAccount')}
                shouldShowBackButton
                onBackButtonPress={() => Navigation.navigate(ROUTES.SETTINGS_SECURITY)}
                onCloseButtonPress={() => Navigation.dismissModal(true)}
            />
            <Form
                formID={ONYXKEYS.FORMS.CLOSE_ACCOUNT_FORM}
                validate={validate}
                onSubmit={showConfirmModal}
                submitButtonText={props.translate('closeAccountPage.closeAccount')}
                style={[styles.flexGrow1, styles.mh5]}
                isSubmitActionDangerous
            >
                <View style={[styles.flexGrow1]}>
                    <Text>{props.translate('closeAccountPage.reasonForLeavingPrompt')}</Text>
                        <TextInput
                            inputID="reasonForLeaving"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            label={props.translate('closeAccountPage.enterMessageHere')}
                            containerStyles={[styles.mt5, styles.closeAccountMessageInput]}
                        />
                        <Text style={[styles.mt5]}>
                            {props.translate('closeAccountPage.enterDefaultContactToConfirm')} <Text style={[styles.textStrong]}>{userEmailOrPhone}</Text>.
                        </Text>
                        <TextInput
                            inputID="phoneOrEmail"
                            autoCapitalize="none"
                            label={props.translate('closeAccountPage.enterDefaultContact')}
                            containerStyles={[styles.mt5]}
                            autoCorrect={false}
                            keyboardType={CONST.KEYBOARD_TYPE.EMAIL_ADDRESS}
                        />
                        <ConfirmModal
                            title={props.translate('closeAccountPage.closeAccountWarning')}
                            onConfirm={onConfirm}
                            onCancel={hideConfirmModal}
                            isVisible={isConfirmModalVisible}
                            prompt={props.translate('closeAccountPage.closeAccountPermanentlyDeleteData')}
                            confirmText={props.translate('common.yes')}
                            cancelText={props.translate('common.cancel')}
                            shouldShowCancelButton
                        />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

CloseAccountPage.propTypes = propTypes;
CloseAccountPage.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        session: {
            key: ONYXKEYS.SESSION,
        },
    }),
)(CloseAccountPage);
