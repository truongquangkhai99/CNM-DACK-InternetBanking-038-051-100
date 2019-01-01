import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import { getUserEntity } from "../utils/authHelper";

const styles = {
  orangeAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: deepOrange[500]
  }
};

function LetterAvatar(props) {
  const { classes } = props;

  const name = getUserEntity() !== "" && getUserEntity().f_name;
  if (name === undefined || name === "")
    return <Avatar alt="Unknown username" className={classes.orangeAvatar} />;

  const letters = name
    .split(" ")
    .map(word => word[0])
    .join("");

  if (letters.length === 1)
    return (
      <Avatar alt={name} className={classes.orangeAvatar}>
        {letters}
      </Avatar>
    );

  return (
    <Avatar alt={name} className={classes.orangeAvatar}>
      {letters[0] + letters[letters.length - 1]}
    </Avatar>
  );
}

LetterAvatar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LetterAvatar);
