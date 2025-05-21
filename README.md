# Django Pomodoro Timer

Django-based Pomodoro Timer - From ChatGPT

- [Django Pomodoro Timer - ChatGPT - Private](https://chatgpt.com/c/682dc3c8-32e4-8002-9bf0-e85b1c871409)
- [Django Pomodoro Timer - ChatGPT - Shared](https://chatgpt.com/share/682dc499-9b50-8002-9a23-9837f8412b9f)

---

I'm a total Python Django fan-boy!

I want to make a pomodoro timer using Django since I already have an app deployed as "Personal Assistant".

Can you create a Pomodoro (directory name `pomodo`) django app which:
- Has a `Sturt` button to start the timer.
- Displays the approximate time elapsed on the page.
- Has a `Paws` button to pause the timer.
- Makes a sound 5 minutes before end time.
- Sounds a cancelable alarm when time is up. The cancel button should read `Okay... I'm done!`

Here’s a complete `pomodo` app you can drop into your “Personal Assistant” project—no backend models needed, just a single view that serves a JS-powered timer page.

<details>
<summary>Directory structure</summary>

```
pomodo/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── views.py
├── urls.py
├── templates/pomodo/timer.html
└── static/pomodo/
    ├── js/timer.js
    ├── css/timer.css
    └── audio/
        ├── warning.mp3
        └── alarm.mp3
```

</details>

---

#### pomodo/apps.py

```python
from django.apps import AppConfig

class PomodoConfig(AppConfig):
    name = 'pomodo'
```

#### pomodo/models.py

```python
# No database models needed for a simple timer
```

#### pomodo/views.py

```python
from django.shortcuts import render

def timer_view(request):
    return render(request, 'pomodo/timer.html')
```

#### pomodo/urls.py

```python
from django.urls import path
from .views import timer_view

app_name = 'pomodo'

urlpatterns = [
    path('', timer_view, name='timer'),
]
```

#### pomodo/templates/pomodo/timer.html

```html
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pomodoro Timer</title>
  <link rel="stylesheet" href="{% static 'pomodo/css/timer.css' %}">
</head>
<body>
  <div class="timer-container">
    <h1>Pomodoro Timer</h1>
    <div id="timer-display">00:00</div>
    <button id="start-button">Sturt</button>
    <button id="pause-button" disabled>Paws</button>
    <button id="cancel-button" style="display:none;">Okay... I'm done!</button>
  </div>

  <audio id="warning-sound" src="{% static 'pomodo/audio/warning.mp3' %}"></audio>
  <audio id="alarm-sound" src="{% static 'pomodo/audio/alarm.mp3' %}" loop></audio>

  <script src="{% static 'pomodo/js/timer.js' %}"></script>
</body>
</html>
```

#### pomodo/static/pomodo/js/timer.js

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const startBtn   = document.getElementById('start-button');
  const pauseBtn   = document.getElementById('pause-button');
  const cancelBtn  = document.getElementById('cancel-button');
  const display    = document.getElementById('timer-display');
  const warningSound = document.getElementById('warning-sound');
  const alarmSound   = document.getElementById('alarm-sound');

  const duration = 25 * 60;  // 25 minutes
  let elapsed   = 0;
  let intervalId = null;

  function updateDisplay() {
    const m = String(Math.floor(elapsed/60)).padStart(2,'0');
    const s = String(elapsed % 60).padStart(2,'0');
    display.textContent = `${m}:${s}`;
  }

  function tick() {
    elapsed++;
    updateDisplay();

    if (elapsed === duration - 300) {
      warningSound.play();        // 5-min warning
    }
    if (elapsed >= duration) {
      clearInterval(intervalId);
      intervalId = null;
      alarmSound.play();          // final alarm
      cancelBtn.style.display = 'inline-block';
      startBtn.disabled = true;
      pauseBtn.disabled = true;
    }
  }

  startBtn.addEventListener('click', () => {
    if (!intervalId) {
      intervalId = setInterval(tick, 1000);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  });

  cancelBtn.addEventListener('click', () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    cancelBtn.style.display = 'none';
    elapsed = 0;
    updateDisplay();
    startBtn.disabled = false;
  });

  updateDisplay();
});
```

#### pomodo/static/pomodo/css/timer.css

```css
.timer-container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  font-family: sans-serif;
}
#timer-display {
  font-size: 48px;
  margin: 20px 0;
}
button {
  font-size: 16px;
  padding: 10px 20px;
  margin: 5px;
}
```

#### pomodo/static/pomodo/audio/

* **warning.mp3** → a gentle chime (5-min warning)
* **alarm.mp3**   → a louder looping alarm (stops when “Okay… I’m done!” is clicked)

---

### Hook it up in your project

1. **Add** `'pomodo'` to `INSTALLED_APPS` in `settings.py`.
2. **Serve** or `collectstatic` so your JS/CSS/audio are accessible.
3. In your main `urls.py`:

   ```python
   from django.urls import include, path

   urlpatterns = [
       # … other patterns …
       path('pomodo/', include('pomodo.urls', namespace='pomodo')),
   ]
   ```
4. Visit `/pomodo/` and enjoy your very own Pomodoro timer with “Sturt”, “Paws” and a cancelable end-of-session alarm!
