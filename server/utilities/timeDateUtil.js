
/**
 * Class for handling date related logic.
 */

function getFormattedDate() {
  const d = new Date();
  return `${d.toLocaleTimeString()}, ${d.toLocaleDateString()}`;
}


module.exports = {
  getFormattedDate,
};
