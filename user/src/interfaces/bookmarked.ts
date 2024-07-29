export interface IBookmarked {
  _id: String;
  id: String;
  messageId: String;
  conversationId: String;
  message: Object ;
  metadata: Object ;
  conversation: Object
  files: Array<any>;
  recipient: Array<any>;
  createdAt: String;
  updatedAt: String;
  map: any;
  filter: any;
}
