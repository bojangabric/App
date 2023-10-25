import React, {useEffect, useState} from 'react';
import {withOnyx} from 'react-native-onyx';
import {ActivityIndicator, View, ScrollView} from 'react-native';
import _ from 'underscore';
import * as Expensicons from '../../../../../components/Icon/Expensicons';
import * as Illustrations from '../../../../../components/Icon/Illustrations';
import styles from '../../../../../styles/styles';
import FixedFooter from '../../../../../components/FixedFooter';
import Button from '../../../../../components/Button';
import PressableWithDelayToggle from '../../../../../components/Pressable/PressableWithDelayToggle';
import Text from '../../../../../components/Text';
import Section from '../../../../../components/Section';
import ONYXKEYS from '../../../../../ONYXKEYS';
import Clipboard from '../../../../../libs/Clipboard';
import themeColors from '../../../../../styles/themes/default';
import localFileDownload from '../../../../../libs/localFileDownload';
import * as Session from '../../../../../libs/actions/Session';
import useLocalize from '../../../../../hooks/useLocalize';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import StepWrapper from '../StepWrapper/StepWrapper';
import {defaultAccount, TwoFactorAuthPropTypes} from '../TwoFactorAuthPropTypes';
import * as TwoFactorAuthActions from '../../../../../libs/actions/TwoFactorAuthActions';
import FormHelpMessage from '../../../../../components/FormHelpMessage';
import Navigation from '../../../../../libs/Navigation/Navigation';
import ROUTES from '../../../../../ROUTES';
import CONST from '../../../../../CONST';

function CodesStep({account = defaultAccount}) {
    const {translate} = useLocalize();
    const {isExtraSmallScreenWidth, isSmallScreenWidth} = useWindowDimensions();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!account.requiresTwoFactorAuth) {
            return;
        }
        Navigation.navigate(ROUTES.SETTINGS_2FA.ENABLED, CONST.NAVIGATION.TYPE.FORCED_UP);
    }, [account.requiresTwoFactorAuth]);

    useEffect(() => {
        if (account.requiresTwoFactorAuth || account.recoveryCodes) {
            return;
        }
        Session.toggleTwoFactorAuth(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- We want to run this when component mounts
    }, []);

    return (
        <StepWrapper
            title={translate('twoFactorAuth.headerTitle')}
            shouldEnableKeyboardAvoidingView={false}
            stepCounter={{
                step: 1,
                text: translate('twoFactorAuth.stepCodes'),
                total: 3,
            }}
        >
            <ScrollView contentContainerStyle={styles.flexGrow1}>
                <Section
                    title={translate('twoFactorAuth.keepCodesSafe')}
                    icon={Illustrations.ShieldYellow}
                    containerStyles={[styles.twoFactorAuthSection]}
                    iconContainerStyles={[styles.ml6]}
                >
                    <View style={styles.mv3}>
                        <Text>{translate('twoFactorAuth.codesLoseAccess')}</Text>
                    </View>
                    <View style={styles.twoFactorAuthCodesBox({isExtraSmallScreenWidth, isSmallScreenWidth})}>
                        {account.isLoading ? (
                            <View style={styles.twoFactorLoadingContainer}>
                                <ActivityIndicator color={themeColors.spinner} />
                            </View>
                        ) : (
                            <>
                                <View style={styles.twoFactorAuthCodesContainer}>
                                    {Boolean(account.recoveryCodes) &&
                                        _.map(account.recoveryCodes.split(', '), (code) => (
                                            <Text
                                                style={styles.twoFactorAuthCode}
                                                key={code}
                                            >
                                                {code}
                                            </Text>
                                        ))}
                                </View>
                                <View style={styles.twoFactorAuthCodesButtonsContainer}>
                                    <PressableWithDelayToggle
                                        text={translate('twoFactorAuth.copy')}
                                        textChecked={translate('common.copied')}
                                        icon={Expensicons.Copy}
                                        inline={false}
                                        onPress={() => {
                                            Clipboard.setString(account.recoveryCodes);
                                            setError('');
                                            TwoFactorAuthActions.setCodesAreCopied();
                                        }}
                                        styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCodesButton]}
                                        textStyles={[styles.buttonMediumText]}
                                    />
                                    <PressableWithDelayToggle
                                        text={translate('common.download')}
                                        icon={Expensicons.Download}
                                        onPress={() => {
                                            localFileDownload('two-factor-auth-codes', account.recoveryCodes);
                                            setError('');
                                            TwoFactorAuthActions.setCodesAreCopied();
                                        }}
                                        inline={false}
                                        styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCodesButton]}
                                        textStyles={[styles.buttonMediumText]}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </Section>
                <FixedFooter style={[styles.mtAuto, styles.pt5]}>
                    {!_.isEmpty(error) && (
                        <FormHelpMessage
                            isError
                            message={translate(error)}
                            style={[styles.mb3]}
                        />
                    )}
                    <Button
                        success
                        text={translate('common.next')}
                        onPress={() => {
                            if (!account.codesAreCopied) {
                                setError('twoFactorAuth.errorStepCodes');
                                return;
                            }
                            TwoFactorAuthActions.setTwoFactorAuthStep('VERIFY');
                            Navigation.navigate(ROUTES.SETTINGS_2FA.VERIFY);
                        }}
                    />
                </FixedFooter>
            </ScrollView>
        </StepWrapper>
    );
}

CodesStep.propTypes = TwoFactorAuthPropTypes;

// eslint-disable-next-line rulesdir/onyx-props-must-have-default
export default withOnyx({
    account: {key: ONYXKEYS.ACCOUNT},
})(CodesStep);
