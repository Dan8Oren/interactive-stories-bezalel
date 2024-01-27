import { SETTINGS } from "../settings"
import AppStateProvider from "./app-state/AppStateProvider"
import StoryBodyView from "./views/content-view/StoryBodyView"
import InteractorInputView from "./views/interactor-input-view/InteractorInputView"
import storyConfig from './story/story-config';
import TimeDisplay from "./components/TimeDisplay";

function App() {

  return (
    <AppStateProvider>
      <h3>
        {storyConfig.name || 'Open Story'}
      </h3>
      <TimeDisplay />
      <StoryBodyView />
      <InteractorInputView />
    </AppStateProvider>
  )
}

export default App
