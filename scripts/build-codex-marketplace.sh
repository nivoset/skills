#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
marketplace_root="$repo_root/.agents/plugins"
plugin_root="$marketplace_root/plugins/nivoset-skills"
manifest_template="$repo_root/templates/codex-plugin/plugin.json"
marketplace_template="$repo_root/templates/codex-plugin/marketplace.json"
patch_version="$(git rev-list --count HEAD)"
version="0.1.$patch_version"

# This directory is generated exclusively by this script.
rm -rf "$plugin_root"
mkdir -p "$plugin_root/.codex-plugin"

while IFS= read -r -d '' tracked_file; do
  destination="$plugin_root/$tracked_file"
  mkdir -p "$(dirname "$destination")"
  cp "$repo_root/$tracked_file" "$destination"
done < <(git -C "$repo_root" ls-files -z 'skills/**')

sed "s/\"version\": \"0.1.0\"/\"version\": \"$version\"/" \
  "$manifest_template" > "$plugin_root/.codex-plugin/plugin.json"
cp "$marketplace_template" "$marketplace_root/marketplace.json"

printf 'Built nivoset-skills %s with %s skills.\n' \
  "$version" \
  "$(find "$plugin_root/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')"
