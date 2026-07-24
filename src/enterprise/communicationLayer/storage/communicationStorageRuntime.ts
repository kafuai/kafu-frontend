import {
  communicationRepository,
} from "../supabaseCommunicationRepository";
import {
  CommunicationUploadService,
} from "./communicationUploadService";
import {
  communicationStorage,
} from "./supabaseCommunicationStorage";

export const communicationUploadService =
  new CommunicationUploadService(
    communicationStorage,
    communicationRepository,
  );
