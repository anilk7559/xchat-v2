export interface IPayoutAccount {
  type: string;
  email?: string;
  bankInfo?: {
    bankName: string;
    bankAddress: string;
    iban: string;
    swift: string;
    beneficiaryName: string;
    beneficiaryAddress: string;
  };
}
