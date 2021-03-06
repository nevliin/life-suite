module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: "src",
                        src: ["assets/**/*.json"],
                        dest: "./dist"
                    }
                ]
            }
        },
        ts: {
            app: {
                files: [{
                        src: ["src/**/*.ts", "!src/.baseDir.ts"],
                        dest: "./dist"
                    }
                ],
                options: {
                    module: "commonjs",
                    target: "es2017",
                    lib: ["es2017"],
                    sourceMap: false,
                    rootDir: "src",
                    experimentalDecorator: true,
                    emitDecoratorMetadata: true,
                    types: ["reflect-metadata"]
                },

            }
        },
        watch: {
            ts: {
                files: ["src/**/*.ts"],
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
