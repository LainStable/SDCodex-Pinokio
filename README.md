# SDCodex for Pinokio

Install and run the SDCodex core application locally through Pinokio. SDCodex
provides a web interface for browsing Civitai models, managing a local model
library, downloads, and plugins.

## Requirements

Pinokio supplies Git, Node.js/npm, Python virtual environments, and `uv`.
The launcher installs the SDCodex core repository and its Python and frontend
dependencies; no Docker installation or AI model download is required.

## Use

1. Choose **Install** in Pinokio and wait for the frontend build to finish.
2. Choose **Start**. Pinokio opens the local SDCodex web interface when the
   backend is ready.
3. On a fresh installation, create the first administrator account in the
   browser. Subsequent visits use the configured sign-in method.
4. Use **Configure** to choose a fixed port and bind address. Stop and start
   SDCodex after changing these settings. Keep `127.0.0.1` for a reverse proxy
   on the same machine. Select `0.0.0.0` only when a proxy on another machine
   needs to connect, and secure network access with your firewall and proxy.
5. Use **Update** to update the launcher and core repository. Use **Reset** to
   remove generated environments and frontend build files before reinstalling.

Reset preserves the cloned SDCodex source and its local database, settings,
and model data.

## API

The backend serves the frontend and API from the same local origin. In the
examples below, substitute the port shown in Pinokio for `<PORT>`. API calls
that require a user session use the `sdcodex_session` cookie.
Replace the sample password with a strong secret; do not store real
credentials in source code.

### JavaScript

```js
const response = await fetch('/api/health');
const health = await response.json();
console.log(health);

// First-run bootstrap; run once, when no user exists.
const setup = await fetch('/api/auth/bootstrap', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    displayName: 'Administrator',
    password: 'change-this-password',
  }),
});
if (!setup.ok) throw new Error(`Bootstrap failed: ${setup.status}`);

const profile = await fetch('/api/profile', { credentials: 'include' });
console.log(await profile.json());
```

### Python

```python
import requests

base_url = "http://127.0.0.1:<PORT>"
session = requests.Session()

health = session.get(f"{base_url}/api/health")
health.raise_for_status()
print(health.json())

# First-run bootstrap; run once, when no user exists.
setup = session.post(
    f"{base_url}/api/auth/bootstrap",
    json={
        "username": "admin",
        "displayName": "Administrator",
        "password": "change-this-password",
    },
)
setup.raise_for_status()

profile = session.get(f"{base_url}/api/profile")
profile.raise_for_status()
print(profile.json())
```

### cURL

```sh
BASE_URL=http://127.0.0.1:<PORT>
curl "$BASE_URL/api/health"

# First-run bootstrap; run once, when no user exists.
curl -c cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","displayName":"Administrator","password":"change-this-password"}' \
  "$BASE_URL/api/auth/bootstrap"

curl -b cookies.txt "$BASE_URL/api/profile"
```

The API also exposes authentication, profile and settings, downloads, library
scanning, plugin management, and system-update endpoints under `/api`. See the
core project's [README](https://github.com/LainStable/SDCodex#readme) for
application details.

## Repositories

- [SDCodex core](https://github.com/LainStable/SDCodex)
- [Pinokio launcher](https://github.com/LainStable/SDCodex-Pinokio)
