import "react-native-url-polyfill/auto";
import { registerRootComponent } from "expo";
import App from "./App";
registerRootComponent(App);
// O Expo local usa registerRootComponent; o Expo Snack procura um export padrão.
export default App;
