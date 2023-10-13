import React from 'react';
import {useNavigation} from '@react-navigation/native';
import HeaderWithBackButton from '../../../../../components/HeaderWithBackButton';
import ScreenWrapper from '../../../../../components/ScreenWrapper';
import FullPageOfflineBlockingView from '../../../../../components/BlockingViews/FullPageOfflineBlockingView';
import * as TwoFactorAuthActions from '../../../../../libs/actions/TwoFactorAuthActions';
import StepWrapperPropTypes from './StepWrapperPropTypes';
import styles from '../../../../../styles/styles';
import ROUTES from '../../../../../ROUTES';
import Navigation from '../../../../../libs/Navigation/Navigation';

function StepWrapper({title = '', stepCounter = null, onBackButtonPress, children = null, shouldEnableKeyboardAvoidingView = true}) {
    const navigation = useNavigation();
    const shouldShowStepCounter = Boolean(stepCounter);

    return (
        <ScreenWrapper
            shouldShowOfflineIndicator={false}
            shouldEnableKeyboardAvoidingView={shouldEnableKeyboardAvoidingView}
            testID={StepWrapper.displayName}
            style={[styles.flex1]}
        >
            <HeaderWithBackButton
                title={title}
                shouldShowStepCounter={shouldShowStepCounter}
                stepCounter={stepCounter}
                onBackButtonPress={() => {
                    if (onBackButtonPress) {
                        onBackButtonPress();
                    } else {
                        const routes = navigation.getState().routes;
                        const prevRoute = routes[routes.length - 2];

                        if (prevRoute && prevRoute.path === `/${ROUTES.SETTINGS_SECURITY}`) {
                            TwoFactorAuthActions.quitAndNavigateBackToSettings();
                        } else {
                            Navigation.navigate(ROUTES.SETTINGS_SECURITY);
                        }
                    }
                }}
            />
            <FullPageOfflineBlockingView>{children}</FullPageOfflineBlockingView>
        </ScreenWrapper>
    );
}

StepWrapper.propTypes = StepWrapperPropTypes;
StepWrapper.displayName = 'StepWrapper';

export default StepWrapper;
