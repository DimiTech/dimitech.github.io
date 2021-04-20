---
layout: default
title: About the Author
---

<h1 class="owner-name">About Me</h1>

{{site.about}}

<div class="pagination">
  {% if site.owner.linkedin %}
    <a href="{{ site.owner.linkedin }}" class="social-media-icons">LinkedIn</a>
  {% endif %}
  {% if site.owner.email %}
    <a href="mailto:{{ site.owner.email }}" class="social-media-icons">E-Mail</a>
  {% endif %}
  {% if site.owner.github %}
    <a href="{{ site.owner.github }}" class="social-media-icons">GitHub</a>
  {% endif %}
  {% if site.owner.stackexchange %}
    <a href="{{ site.owner.stackexchange }}" class="social-media-icons">StackExchange</a>
  {% endif %}
</div>
