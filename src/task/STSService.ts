class STSService {
  private static instance: STSService;
  private static cachedCredentials: Date | null = null;

  public static getInstance(): STSService {
    if (!STSService.instance) {
      STSService.instance = new STSService();
    }
    return STSService.instance;
  }

  private static isCredentialsValid(): boolean {
    if (!STSService.cachedCredentials) {
      console.log(false);
      return false;
    }
    console.log(
      JSON.stringify({
        STSService: STSService.cachedCredentials.getTime(),
        now: Date.now(),
        isCredentialsValid: STSService.cachedCredentials.getTime() > Date.now(),
      }),
    );
    // Check if credentials are expired or about to expire
    return STSService.cachedCredentials.getTime() > Date.now();
  }

  public async assumeRole(): Promise<string> {
    if (STSService.isCredentialsValid()) {
      return STSService.cachedCredentials.toString();
    }

    STSService.cachedCredentials = new Date(Date.now() + 10);
    console.log(STSService.cachedCredentials.getTime());
    return STSService.cachedCredentials.getTime().toLocaleString();
  }
}

export const StsService = STSService.getInstance();
export default StsService;
