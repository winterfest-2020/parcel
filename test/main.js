const { access, unlink } = require("fs").promises;
const test = require("ava");
const execa = require("execa");

test("run", async (t) => {
    t.teardown(async () => {
        await unlink("gmartigny.midi");
        await unlink("test.midi");
    });

    try {
        await execa("./cli");
    }
    catch ({ exitCode, stdout }) {
        t.is(exitCode, 2);
        t.snapshot(stdout, "show help");
    }

    {
        await execa("./cli", ["gmartigny"]);
        const error = await access("gmartigny.midi");
        t.true(error === undefined);
    }

    {
        await execa("./cli", ["gmartigny", "--filename", "test.midi"]);
        const error = await access("test.midi");
        t.true(error === undefined);
    }
});
