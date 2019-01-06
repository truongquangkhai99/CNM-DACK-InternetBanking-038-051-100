import React from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Contacts as ContactsIcon,
  Person as PersonIcon
} from "@material-ui/icons";

export const mainListItems = (
  <div>
    <Link to="/payment-accounts">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Payment Accounts" />
      </ListItem>
    </Link>
    <Link to="/internal-transfers">
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Internal transfers" />
      </ListItem>
    </Link>
    <Link to="/contacts">
      <ListItem button>
        <ListItemIcon>
          <ContactsIcon />
        </ListItemIcon>
        <ListItemText primary="Contacts" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <Link to="/sign-out">
      <ListItem button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Sign out" />
      </ListItem>
    </Link>
  </div>
);
