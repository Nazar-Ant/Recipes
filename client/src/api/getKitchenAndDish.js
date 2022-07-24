export default async function getKitchenAndDish() {
  try {
    const res = await fetch("http://localhost:4000/enums");
    return res.json();
  } catch (err) {
    return err;
  }
}
