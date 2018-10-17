module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: "src",
                        src: ["assets/**/*.json"],
                        dest: "../build/server/dist"
                    },
                    {
                        expand: false,
                        src: ["package.json"],
                        dest: "../build/server/package.json"
                    },
                    {
                        expand: false,
                        src: ["start.js"],
                        dest: "../build/server/start.js"
                    }
                ]
            }
        },
        ts: {
            app: {
                files: [{
                    src: ["src/**/*.ts", "!src/.baseDir.ts"],
                    dest: "../build/server/dist"
                }],
                options: {
                    module: "commonjs",
                    target: "es2017",
                    sourceMap: false,
                    rootDir: "src"
                }
            }
        },
        watch: {
            ts: {
                files: ["src/**/*.ts", "!src/.baseDir.ts"],
                tasks: ["ts"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "copy",
        "ts"
    ]);

};
