param(
    [string]$Message = "Auto-commit from pokemon_app"
)

# Simple helper script to add, commit, and push the current repository.
# Make sure you have already run `git init` and added a remote named `origin`.

git add .
git commit -m $Message
git push origin main






