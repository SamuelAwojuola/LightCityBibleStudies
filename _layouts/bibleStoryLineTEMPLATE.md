---
# the {{content}} is the dynamic part of the page which are
# 1. the storyLineTable itself
# 2. the details section
---
{% include BStL-head1.html %}

{{content}}

{% include BStL-detailsSection-ShowHTML.html %}
{% include BStL-storylineEditorSection.html %}
{% include BStL-foot.html %}