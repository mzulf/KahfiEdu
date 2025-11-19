import { Card, CardContent, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

// ============================================
// HELPER FUNCTIONS UNTUK WHITE BOX TESTING
// ============================================

/**
 * Validasi rules untuk field Title
 * Statement: S1-S7
 */
export function validateTitleRules(title) {
  // S1: Check required
  if (!title || title.trim() === "") {
    // S2: Return required error
    return { isValid: false, error: "Judul wajib diisi" };
  }
  
  // S3: Check minLength
  if (title.length < 20) {
    // S4: Return minLength error
    return { isValid: false, error: "Judul minimal 20 karakter" };
  }
  
  // S5: Check maxLength
  if (title.length > 100) {
    // S6: Return maxLength error
    return { isValid: false, error: "Judul maksimal 100 karakter" };
  }
  
  // S7: Return valid
  return { isValid: true, error: null };
}

/**
 * Validasi rules untuk field Description
 * Statement: S8-S14
 */
export function validateDescriptionRules(description) {
  // S8: Check required
  if (!description || description.trim() === "") {
    // S9: Return required error
    return { isValid: false, error: "Deskripsi wajib diisi" };
  }
  
  // S10: Check minLength
  if (description.length < 100) {
    // S11: Return minLength error
    return { isValid: false, error: "Deskripsi minimal 100 karakter" };
  }
  
  // S12: Check maxLength
  if (description.length > 1000) {
    // S13: Return maxLength error
    return { isValid: false, error: "Deskripsi maksimal 1000 karakter" };
  }
  
  // S14: Return valid
  return { isValid: true, error: null };
}

/**
 * Check apakah ada error pada title
 * Statement: S15-S17
 */
export function hasTitleError(errors) {
  // S15: Check if errors.title exists
  if (errors && errors.title) {
    // S16: Return true (has error)
    return true;
  }
  // S17: Return false (no error)
  return false;
}

/**
 * Check apakah ada error pada description
 * Statement: S18-S20
 */
export function hasDescriptionError(errors) {
  // S18: Check if errors.description exists
  if (errors && errors.description) {
    // S19: Return true (has error)
    return true;
  }
  // S20: Return false (no error)
  return false;
}

/**
 * Get error message untuk title
 * Statement: S21-S23
 */
export function getTitleErrorMessage(errors) {
  // S21: Check if errors and errors.title exist
  if (errors && errors.title && errors.title.message) {
    // S22: Return error message
    return errors.title.message;
  }
  // S23: Return null (no message)
  return null;
}

/**
 * Get error message untuk description
 * Statement: S24-S26
 */
export function getDescriptionErrorMessage(errors) {
  // S24: Check if errors and errors.description exist
  if (errors && errors.description && errors.description.message) {
    // S25: Return error message
    return errors.description.message;
  }
  // S26: Return null (no message)
  return null;
}

/**
 * Validasi complete form data
 * Statement: S27-S35
 */
export function validateCompleteForm(formData) {
  const errors = {};
  
  // S27: Validate title
  const titleValidation = validateTitleRules(formData.title);
  // S28: Check if title invalid
  if (!titleValidation.isValid) {
    // S29: Add title error
    errors.title = { message: titleValidation.error };
  }
  
  // S30: Validate description
  const descValidation = validateDescriptionRules(formData.description);
  // S31: Check if description invalid
  if (!descValidation.isValid) {
    // S32: Add description error
    errors.description = { message: descValidation.error };
  }
  
  // S33: Check if has any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  // S34: Return result
  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : {}
  };
}

/**
 * Determine component state
 * Statement: S35-S39
 */
export function determineComponentState(errors, submitting) {
  // S35: Check if submitting
  if (submitting) {
    // S36: Return submitting state
    return "SUBMITTING";
  }
  
  // S37: Check if has errors
  if (errors && (errors.title || errors.description)) {
    // S38: Return error state
    return "HAS_ERRORS";
  }
  
  // S39: Return normal state
  return "NORMAL";
}

// ============================================
// KOMPONEN UTAMA (TIDAK BERUBAH)
// ============================================

export default function GeneralInfoCard({ control, errors, submitting }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" mb={1}>
            Basic Information
          </Typography>

          {/* FIELD JUDUL */}
          <div>
            <InputLabel shrink>Judul</InputLabel>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Judul wajib diisi",
                minLength: {
                  value: 20,
                  message: "Judul minimal 20 karakter",
                },
                maxLength: {
                  value: 100,
                  message: "Judul maksimal 100 karakter",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={submitting}
                />
              )}
            />
          </div>

          {/* FIELD DESKRIPSI */}
          <div>
            <InputLabel shrink>Deskripsi</InputLabel>
            <Controller
              name="description"
              control={control}
              rules={{
                required: "Deskripsi wajib diisi",
                minLength: {
                  value: 100,
                  message: "Deskripsi minimal 100 karakter",
                },
                maxLength: {
                  value: 1000,
                  message: "Deskripsi maksimal 1000 karakter",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={submitting}
                />
              )}
            />
          </div>

          
        </Stack>
      </CardContent>
    </Card>
  );
}