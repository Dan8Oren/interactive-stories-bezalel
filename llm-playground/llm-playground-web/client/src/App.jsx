import { SETTINGS } from "../settings"
import AppStateProvider from "./app-state/AppStateProvider"
import StoryBodyView from "./views/content-view/StoryBodyView"
import InteractorInputView from "./views/interactor-input-view/InteractorInputView"
import storyConfig from './story/story-config';
import TimeDisplay from "./components/TimeDisplay";
import videoBg from './assets/1.webm'

function App() {

  return (
    <AppStateProvider>
      <div className='main'>
        <div className="overlay"></div>
          <video src={videoBg} autoPlay loop muted />
          <h1 className='title'>
            {storyConfig.name || 'Open Story'}
          </h1>
          <TimeDisplay />
          <StoryBodyView />
          <InteractorInputView />
      </div>
    </AppStateProvider>
  )
}

export default App
