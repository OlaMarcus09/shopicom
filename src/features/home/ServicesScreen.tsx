import { HomeScreen, type HomeScreenProps } from './HomeScreen';

export function ServicesScreen(props: Omit<HomeScreenProps, 'listingScope' | 'pageTitle'>) {
  return <HomeScreen {...props} listingScope="services" pageTitle="Services" />;
}
