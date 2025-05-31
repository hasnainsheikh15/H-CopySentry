document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle-protection");
  const statusText = document.getElementById("status");

  chrome.storage.local.get("protectionEnabled", (data) => {
    toggle.checked = data.protectionEnabled !== false;
    statusText.innerHTML = `Protection is currently <strong> ${
      toggle.checked ? "enabled" : "disabled"
    } </strong>`;
  });
  
  toggle.addEventListener("change" , () => {
    chrome.storage.local.set({"protectionEnabled": toggle.checked});
    statusText.innerHTML = `Protection is currently <strong> ${
      toggle.checked ? "enabled" : "disabled"
    } </strong>`;
  })
});
