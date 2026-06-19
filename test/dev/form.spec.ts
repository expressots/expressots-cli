/**
 * Unit tests for container-dev form helpers (docker-compose orchestration).
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { EventEmitter } from "events";

const spawnMock = jest.fn();

jest.mock("cross-spawn", () => {
	const fn = (...args: unknown[]) => spawnMock(...args);
	(fn as unknown as { sync: jest.Mock }).sync = jest.fn((...args: unknown[]) =>
		spawnMock(...args),
	);
	return fn;
});

import {
	attachToContainer,
	openShell,
	showLogs,
	showStatus,
	startDevContainer,
	stopDevContainer,
	type DevOptions,
} from "../../src/dev/form";

const baseOptions: DevOptions = {
	container: true,
	service: "app",
	composeFile: "docker-compose.development.yml",
	build: false,
	detach: true,
	debugPort: 9229,
	watch: true,
	follow: true,
	tail: 50,
};

let originalCwd: string;
let tmpDir: string;
let logSpy: jest.SpyInstance;

function syncSuccess(): {
	status: number;
	error: null;
	stdout: string;
	stderr: string;
} {
	return { status: 0, error: null, stdout: "stats table", stderr: "" };
}

function syncFailure(): {
	status: number;
	error: Error;
	stdout: string;
	stderr: string;
} {
	return {
		status: 1,
		error: new Error("docker not running"),
		stdout: "",
		stderr: "",
	};
}

beforeEach(() => {
	originalCwd = process.cwd();
	tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ex-cli-dev-form-"));
	process.chdir(tmpDir);
	logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
	spawnMock.mockReset();
});

afterEach(() => {
	process.chdir(originalCwd);
	logSpy.mockRestore();
	fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("dev/form", () => {
	it("startDevContainer exits early when compose file is missing", async () => {
		await startDevContainer(baseOptions);

		expect(spawnMock).not.toHaveBeenCalled();
		expect(logSpy.mock.calls.some((c) => String(c[0]).includes("not found"))).toBe(
			true,
		);
	});

	it("startDevContainer exits when Docker is not running", async () => {
		fs.writeFileSync(
			path.join(tmpDir, baseOptions.composeFile),
			"services: {}\n",
		);
		spawnMock.mockReturnValue(syncFailure());

		await startDevContainer(baseOptions);

		expect(logSpy.mock.calls.some((c) => String(c[0]).includes("Docker is not running"))).toBe(
			true,
		);
	});

	it("startDevContainer runs compose up in detached mode", async () => {
		fs.writeFileSync(
			path.join(tmpDir, baseOptions.composeFile),
			"services: {}\n",
		);
		spawnMock.mockReturnValue(syncSuccess());

		await startDevContainer({ ...baseOptions, build: true });

		expect(spawnMock).toHaveBeenCalled();
		const composeCalls = spawnMock.mock.calls.filter(
			([cmd, args]) => cmd === "docker" && args?.[0] === "compose",
		);
		expect(composeCalls.some(([, args]) => args.includes("build"))).toBe(true);
		expect(composeCalls.some(([, args]) => args.includes("up"))).toBe(true);
		expect(composeCalls.some(([, args]) => args.includes("-d"))).toBe(true);
	});

	it("stopDevContainer uses default compose when dev file is missing", async () => {
		fs.writeFileSync(path.join(tmpDir, "docker-compose.yml"), "services: {}\n");
		spawnMock.mockReturnValue(syncSuccess());

		await stopDevContainer(baseOptions);

		expect(spawnMock).toHaveBeenCalledWith(
			"docker",
			expect.arrayContaining(["compose", "-f", expect.stringContaining("docker-compose.yml"), "down"]),
			expect.any(Object),
		);
	});

	it("attachToContainer reports missing compose file", async () => {
		await attachToContainer(baseOptions);
		expect(logSpy.mock.calls.some((c) => String(c[0]).includes("not found"))).toBe(
			true,
		);
	});

	it("openShell spawns compose exec when compose file exists", async () => {
		fs.writeFileSync(
			path.join(tmpDir, baseOptions.composeFile),
			"services: {}\n",
		);
		spawnMock.mockReturnValue(new EventEmitter());

		await openShell(baseOptions);

		expect(spawnMock).toHaveBeenCalledWith(
			"docker",
			[
				"compose",
				"-f",
				path.join(tmpDir, baseOptions.composeFile),
				"exec",
				"app",
				"sh",
			],
			expect.objectContaining({ stdio: "inherit" }),
		);
	});

	it("showStatus runs compose ps and docker stats", async () => {
		fs.writeFileSync(
			path.join(tmpDir, baseOptions.composeFile),
			"services: {}\n",
		);
		spawnMock.mockReturnValue(syncSuccess());

		await showStatus(baseOptions);

		expect(spawnMock.mock.calls.length).toBeGreaterThanOrEqual(2);
		expect(
			spawnMock.mock.calls.some(
				([cmd, args]) => cmd === "docker" && args?.[0] === "stats",
			),
		).toBe(true);
	});

	it("showLogs spawns compose logs with tail and follow", async () => {
		fs.writeFileSync(
			path.join(tmpDir, baseOptions.composeFile),
			"services: {}\n",
		);
		spawnMock.mockReturnValue(new EventEmitter());

		await showLogs(baseOptions);

		expect(spawnMock).toHaveBeenCalledWith(
			"docker",
			expect.arrayContaining([
				"compose",
				"-f",
				path.join(tmpDir, baseOptions.composeFile),
				"logs",
				"-f",
				"--tail",
				"50",
				"app",
			]),
			expect.any(Object),
		);
	});
});
