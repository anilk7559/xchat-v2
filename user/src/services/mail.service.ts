import { APIRequest } from './api-request';

class MailService extends APIRequest {
  inviteUser(emails: any) {
    return this.post('/newsletter/invite', emails);
  }
}

export const mailService = new MailService();
