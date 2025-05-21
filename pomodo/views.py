from django.shortcuts import render


def timer_view(request):
    return render(request, "pomodo/timer.html")
