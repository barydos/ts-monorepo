#!/bin/bash

# Usage: ./unit-test.sh {applications/packages}/{app/package}/path/to/file.test.ts
# Right+click and copy relative path

# Get the relative path to the test file from the first argument
TEST_FILE=$1
TEST_FILE_ABSOLUTE="$(realpath "../../$TEST_FILE")"

# String to trim - {applications/packages}/${app/package}/
APPLICATION_PATH=$(realpath "$(dirname "$0")/..")
TRIM=$APPLICATION_PATH

# Relative file path - path/to/file.test.ts
TEST_FILE=${TEST_FILE_ABSOLUTE#$TRIM}

# Extract the main file to test coverage for - path/to/file.ts
COVERAGE_FILE="${TEST_FILE%.test.ts}.ts"

# Run Jest with the specified test file and collect coverage for the source file
npx jest --coverage "$TEST_FILE" --collectCoverageFrom="$SOURCE_FILES"
