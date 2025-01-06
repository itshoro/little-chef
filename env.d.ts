declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly INVITE_CODE: string;
    readonly UPLOADTHING_TOKEN: string;
  }
}
