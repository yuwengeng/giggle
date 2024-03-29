import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Button, FormGroup, Menu, MenuItem, TextField } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { css } from "@emotion/react";
import * as yup from "yup";

import { useAppData } from "../contexts/appData";
import { useResults } from "../contexts/resultsData";
import { TSearchInput } from "../types/common";

const formSchema = yup.object().shape({
  query: yup.string().required(),
  engine: yup.string().required(),
});

export default function Search() {
  const [enginesEl, setEnginesEl] = useState<null | HTMLElement>(null);
  const { engines, searchInput, setSearchInput } = useAppData();
  const enginesOpen = !!enginesEl;
  const selectedEngine = engines.find((e) => e.id === searchInput.engine);

  const { refetch } = useResults();

  const handleEnginesClick = (event: React.MouseEvent<HTMLElement>) => {
    setEnginesEl(event.currentTarget);
  };

  const handleEnginesClose = () => {
    setEnginesEl(null);
  };

  const handleEngineChange = (value: string) => () => {
    handleChange({
      target: { name: "engine", value },
    } as React.ChangeEvent<HTMLInputElement>);
    handleEnginesClose();
  };

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput({
      ...searchInput,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formSchema.isValidSync(searchInput)) return;
    Router.push({
      pathname: "/results",
      query: { ...searchInput, page: 1 } as TSearchInput,
    }).then(() => {
      refetch();
    });
  };

  useEffect(() => {
    handleChange({
      target: { name: "engine", value:'001026332474729733297:elhdjihv5ea' },
    } as React.ChangeEvent<HTMLInputElement>)
  }, [])
  return (
    <div css={{ width: "100%", maxWidth: "35rem" }}>
      <form
        onSubmit={handleSubmit}
        css={css`
          display: flex;
          align-items: center;
          width: 100%;
        `}
      >
        <FormGroup row sx={{ width: "100%" }}>
          <TextField
            data-testid="query-input"
            name="query"
            value={searchInput.query}
            onChange={handleChange}
            sx={{ flex: "1 1 auto" }}
            InputProps={{
              sx: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
            size="small"
          />
          <Button
            data-testid="engines-button"
            id="engines-button"
            aria-controls={enginesOpen ? "engines-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={enginesOpen ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleEnginesClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <span
              css={{
                // marginTop: "4px",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {selectedEngine?.name}
            </span>
          </Button>
        </FormGroup>
        <Menu
          data-testid="engines-menu"
          id="engines-menu"
          MenuListProps={{
            "aria-labelledby": "engines-button",
          }}
          anchorEl={enginesEl}
          open={enginesOpen}
          onClose={handleEnginesClose}
        >
          {engines.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
              onClick={handleEngineChange(id)}
              selected={selectedEngine?.id === id}
            >
              {name}
            </MenuItem>
          ))}
        </Menu>
        <Button data-testid="submit-button" 
        sx={visuallyHidden}
         type="submit">
          Search
        </Button>
      </form>
    </div>
  );
}
