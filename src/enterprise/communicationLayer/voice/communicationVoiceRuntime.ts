import {
  communicationUploadService,
} from "../storage/communicationStorageRuntime";
import {
  BrowserVoiceRecorder,
} from "./browserVoiceRecorder";
import {
  CommunicationVoiceService,
} from "./communicationVoiceService";

export function createCommunicationVoiceService(): CommunicationVoiceService {
  return new CommunicationVoiceService(
    new BrowserVoiceRecorder(),
    communicationUploadService,
  );
}
