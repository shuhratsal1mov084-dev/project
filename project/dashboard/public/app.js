async function addChust() {
  const text = document.getElementById("chust").value;

  await fetch("/api/chust", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  alert("Qo‘shildi");
}

async function load() {
  const res = await fetch("/api/data");
  const data = await res.json();

  document.getElementById("out").innerHTML =
    "Users: " + data.users.length +
    "<br>VIP: " + data.vip.length +
    "<br>Chust: " + data.chust.length;
}