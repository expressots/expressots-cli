function getPlatformCommand(binName: string) {
    const isWindows = process.platform === "win32";
    return isWindows ? `${binName}.cmd` : binName;
}

export { getPlatformCommand };
