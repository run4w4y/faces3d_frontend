import React from 'react';
import { DefaultView, HomeView } from '../views';

export const HomeRoute: React.FC = () => {
    return (
        <DefaultView>
            <HomeView />
        </DefaultView>
    );
}
